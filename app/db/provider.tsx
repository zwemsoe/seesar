import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { SQLJsDatabase } from "drizzle-orm/sql-js";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { expoDb, initialize } from "./drizzle";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

export type LocalDatabase = SQLJsDatabase | ExpoSQLiteDatabase | null;

type ContextType = { db: LocalDatabase };

export const DatabaseContext = React.createContext<ContextType>({ db: null });

export const useDatabase = () => useContext(DatabaseContext);

export function DatabaseProvider({ children }: PropsWithChildren) {
  useDrizzleStudio(expoDb);
  const [db, setDb] = useState<LocalDatabase>(null);

  useEffect(() => {
    if (db) return;
    initialize().then((newDb) => {
      setDb(newDb);
    });
  }, []);

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
}
