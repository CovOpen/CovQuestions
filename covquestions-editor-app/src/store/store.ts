import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { questionnaireInEditor } from "./questionnaireInEditor";
import { throttle } from "lodash";
const rootReducer = combineReducers({ questionnaireInEditor });

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
    localStorage.setItem("state_version", JSON.stringify(1));
  } catch {
    // We'll just ignore write errors
  }
};

const loadState = () => {
  try {
    const state_version = JSON.parse(localStorage.getItem("state_version") || "0");
    if (state_version <= 1) {
      const serializedState = localStorage.getItem("state");
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
};

export const store = configureStore({ reducer: rootReducer, preloadedState: loadState() });

store.subscribe(throttle(() => saveState(store.getState()), 1000));

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
