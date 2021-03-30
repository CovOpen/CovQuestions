import React, { useState } from "react";
import { Question } from "@covopen/covquestions-js";
import { makeStyles, Paper, Table, TableBody, TableContainer } from "@material-ui/core";
import { unique } from "../../../../../utils/unique";
import { TestCaseItemTableRow } from "./TestCaseItemTableRow";
import { AddTestCaseItemDropDown } from "./AddTestCaseItemDropDown";

export type OnItemChange = ({ itemId, value }: { itemId: string; value: any }) => void;

export const TestCaseItemsEditor: React.FC<{
  availableItems: Question[];
  currentStoreItems: { [id: string]: any };
  onItemChange: OnItemChange;
}> = ({ currentStoreItems, availableItems, onItemChange }) => {
  const [additionalItems, setAdditionalItems] = useState<string[]>([]);

  const useStyles = makeStyles(() => ({
    table: {
      minWidth: 450,
    },
  }));

  const classes = useStyles();

  function onItemAdd(id: string) {
    setAdditionalItems((items) => [...items, id]);

    //  Set empty array for optional multiselect questions
    const item = availableItems.find((item) => id === item.id);
    if (item?.type === "multiselect" && item.optional) {
      onItemChange({ itemId: id, value: [] });
    }
  }

  function onItemDelete(id: string) {
    setAdditionalItems((items) => items.filter((item) => item !== id));
    onItemChange({ itemId: id, value: undefined });
  }

  function onValueChange(id: string, value: any) {
    setAdditionalItems((items) => unique([...items, id]));
    onItemChange({ itemId: id, value: value as string });
  }

  const itemIdInStoreWithDefinedValue = Object.entries(currentStoreItems)
    .filter(([_, value]) => value !== undefined)
    .map(([id, _]) => id);
  const displayedItemIds = unique([...itemIdInStoreWithDefinedValue, ...additionalItems]);

  const unusedItemIds = availableItems.map((it) => it.id).filter((it) => !displayedItemIds.includes(it));

  const sortedItemIds = availableItems.map(({ id }) => id).filter((id) => displayedItemIds.includes(id));

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableBody>
            {sortedItemIds.map((id) => (
              <TestCaseItemTableRow
                id={id}
                key={id}
                value={currentStoreItems[id]}
                label={id}
                onChange={(value) => onValueChange(id, value)}
                onDelete={() => onItemDelete(id)}
                item={availableItems.find((it) => it.id === id)!}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {unusedItemIds.length > 0 ? (
        <AddTestCaseItemDropDown
          id={"newItem"}
          onChange={onItemAdd}
          availableItems={unusedItemIds}
          label={"Add item"}
        />
      ) : null}
    </>
  );
};
