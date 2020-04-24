import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { questionnaireInSync } from "./questionnaireInSync";
import { questionnaireInEditor } from "./questionnaireInEditor";

const rootReducer = combineReducers({ questionnaireInSync, questionnaireInEditor });

export const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
