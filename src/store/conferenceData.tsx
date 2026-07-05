import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

import { loadConferenceDataWithMeta } from "@services/data";
import { ConferenceData } from "@app-types/conference";

type ConferenceContextValue = {
  data: ConferenceData | null;
  loading: boolean;
  refreshing: boolean;
  error: Error | null;
  fromCache: boolean;
  fetchedAt: string | null;
  isOffline: boolean;
  lastFetchFailed: boolean;
  conferenceYear: number;
  resolvedYear: number;
  refresh: () => Promise<void>;
};

const ConferenceDataContext = createContext<ConferenceContextValue | undefined>(
  undefined,
);

export function ConferenceDataProvider({
  children,
  year,
}: {
  children: React.ReactNode;
  year: number;
}) {
  const [data, setData] = useState<ConferenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [lastFetchFailed, setLastFetchFailed] = useState(false);
  const [resolvedYear, setResolvedYear] = useState(year);
  const hasLoaded = useRef(false);
  const requestIdRef = useRef(0);

  const fetchData = useCallback(
    async (opts?: { forceRefresh?: boolean }) => {
      const requestId = (requestIdRef.current += 1);
      const isRefresh = opts?.forceRefresh || hasLoaded.current;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const result = await loadConferenceDataWithMeta(year);
        if (requestId !== requestIdRef.current) return;
        setData(result.data);
        setFromCache(result.fromCache);
        setFetchedAt(result.fetchedAt);
        setResolvedYear(result.resolvedYear ?? year);
        setError(null);
        setIsOffline(false);
        setLastFetchFailed(false);
        hasLoaded.current = true;
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setError(err as Error);
        const navigatorOffline =
          typeof navigator !== "undefined" && navigator.onLine === false;
        setIsOffline((prev) => prev || navigatorOffline);
        setLastFetchFailed(true);
        if (!hasLoaded.current) {
          setData(null);
        }
      } finally {
        if (requestId !== requestIdRef.current) return;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [year],
  );

  useEffect(() => {
    setData(null);
    setFetchedAt(null);
    setFromCache(false);
    setError(null);
    setResolvedYear(year);
    hasLoaded.current = false;
    fetchData();
  }, [fetchData, year]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const offline = state.isConnected === false || state.isInternetReachable === false;
      setIsOffline(offline);
    });

    NetInfo.fetch().then((state: NetInfoState) => {
      const offline = state.isConnected === false || state.isInternetReachable === false;
      setIsOffline(offline);
    });

    return () => {
      unsubscribe();
    };
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData({ forceRefresh: true });
  }, [fetchData]);

  const value = useMemo<ConferenceContextValue>(
    () => ({
      data,
      loading,
      refreshing,
      error,
      fromCache,
      fetchedAt,
      isOffline,
      lastFetchFailed,
      conferenceYear: year,
      resolvedYear,
      refresh,
    }),
    [
      data,
      error,
      fetchedAt,
      fromCache,
      isOffline,
      lastFetchFailed,
      loading,
      refresh,
      refreshing,
      year,
      resolvedYear,
    ],
  );

  return (
    <ConferenceDataContext.Provider value={value}>
      {children}
    </ConferenceDataContext.Provider>
  );
}

export function useConferenceData(): ConferenceContextValue {
  const ctx = useContext(ConferenceDataContext);
  if (!ctx) {
    throw new Error("useConferenceData must be used within ConferenceDataProvider");
  }
  return ctx;
}
