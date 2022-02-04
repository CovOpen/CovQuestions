import React from "react";
import { Result } from "@covopen/covquestions-js";
import { createStyles, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import DOMPurify from 'dompurify';

const useStyles = makeStyles(() =>
  createStyles({
    rootPaper: {
      padding: "20px",
    },
    resultCategory: {
      opacity: 0.7,
      fontWeight: 500,
      fontSize: 18,
      lineHeight: "20px",
    },
    resultText: {
      color: "#686868",
      opacity: 1,
      fontSize: 16,
      lineHeight: "20px",
    },
  })
);

export const ResultComponent: React.FC<{ results: Result[] }> = ({ results }) => {
  const classes = useStyles();

  function renderResults() {
    return results.map((result) => (
      <Grid item container spacing={1}>
        <Grid item>
          <Typography className={classes.resultCategory}>{result.resultCategory.description}</Typography>
        </Grid>
        <Grid item>
          <Typography
            className={classes.resultText}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(result.result.text),
            }}
          />
        </Grid>
      </Grid>
    ));
  }

  function renderNoResult() {
    return (
      <Grid item>
        <Typography className={classes.resultText}>No result applies</Typography>
      </Grid>
    );
  }

  return (
    <Paper className={classes.rootPaper}>
      <Grid container spacing={4}>
        {results.length > 0 ? renderResults() : renderNoResult()}
      </Grid>
    </Paper>
  );
};
