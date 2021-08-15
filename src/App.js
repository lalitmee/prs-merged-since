import React, { useState, useEffect, useCallback } from 'react';
import prsMergedSince from 'prs-merged-since';
import { Octokit } from '@octokit/core';
import debounce from 'lodash/debounce';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { useDebounce } from 'utils/customHooks';

function App() {
  const [prsData, setPrsData] = useState([]);
  const [owner, setOwner] = useState(null);
  const [repository, setRepository] = useState(null);
  const [tag, setTag] = useState(null);
  const debouncedOwner = useDebounce(owner, 1000);
  const debouncedRepository = useDebounce(repository, 1000);
  const octokit = new Octokit({ auth: process.env.TOKEN });

  function handleChangeOwner(event) {
    const {
      target: { value },
    } = event;
    setOwner(value);
  }

  function handleRepositoryChange(event) {
    const {
      target: { value },
    } = event;
    setRepository(value);
  }

  function handleTagChange(event) {
    const {
      target: { value },
    } = event;
    setTag(value);
  }

  async function getData() {
    if (debouncedOwner && debouncedRepository) {
      const response = await octokit.request(
        'GET /repos/{owner}/{repo}/pulls',
        {
          owner: debouncedOwner,
          repo: debouncedRepository,
          type: 'private',
        },
      );
      console.log({ response });
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      margin="auto"
      width={1}
    >
      <Typography variant="h5">PRs Merged Since</Typography>

      <Box my={1}>
        <TextField
          variant="outlined"
          label="Owner"
          value={owner}
          onChange={handleChangeOwner}
          autofocus
        />
      </Box>

      <Box my={1}>
        <TextField
          variant="outlined"
          label="Repository"
          value={repository}
          onChange={handleRepositoryChange}
          autofocus
        />
      </Box>
      <Box my={1}>
        <TextField
          variant="outlined"
          label="Tag"
          value={tag}
          onChange={handleTagChange}
          autofocus
        />
      </Box>

      <Button variant="outlined" onClick={getData}>
        Get Data
      </Button>
    </Box>
  );
}

export default App;
