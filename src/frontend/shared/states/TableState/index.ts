// @ts-nocheck
import { compareId } from "@/utils/state";
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

// table pagination - key is table `_id`
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TablePaginationState = atomFamily(
  ({ id, defaultPage = 1, defaultPageSize = 10 }) => {
    const baseAtom = atom({
      page: defaultPage,
      pageSize: defaultPageSize,
      count: 0,
      total: 0,
    });
    baseAtom.onMount = (setAtom) => {
      return () => {
        // reset state on unmount
        setAtom({
          page: defaultPage,
          pageSize: defaultPageSize,
          count: 0,
          total: 0,
        });
      };
    };
    return baseAtom;
  },
  compareId
);
