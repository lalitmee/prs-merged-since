import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Octokit } from '@octokit/core';
import { Virtuoso } from 'react-virtuoso';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import isEmpty from 'lodash/isEmpty';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import grey from '@material-ui/core/colors/grey';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  toggleButton: { textTransform: 'none' },
});

function App() {
  const styles = useStyles();
  const [tab, setTab] = useState('prs-list');
  const [prsData, setPrsData] = useState([]);
  const [prsLinks, setPrsLinks] = useState([]);
  const [urlData, setUrlData] = useState({
    owner: 'lalitmee',
    repository: 'dotfiles',
    baseBrach: '',
  });
  const [repoType, setRepoType] = useState('public');
  const [prState, setPrState] = useState('open');
  const [loading, setLoading] = useState(false);
  const octokit = new Octokit({ auth: process.env.REACT_APP_TOKEN });

  useEffect(() => {
    if (!isEmpty(prsData)) {
      setLoading(false);
      const links = prsData.map(({ html_url: htmlUrl }) => htmlUrl);
      setPrsLinks(links);
    }
  }, [prsData]);

  function handleChange(event) {
    event.preventDefault();
    setUrlData(state => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  }

  function handlePrStateChange(_, newPrState) {
    setPrState(newPrState);
  }

  function handleRepoTypeChange(_, newRepoType) {
    setRepoType(newRepoType);
  }

  async function getData() {
    setLoading(true);
    const { owner, repository, baseBrach } = urlData || {};
    if (owner && repository) {
      const response = await octokit.request(
        'GET /repos/{owner}/{repo}/pulls',
        {
          owner,
          repo: repository,
          type: repoType,
          state: prState,
          base: baseBrach,
          per_page: 100,
        },
      );
      const { data = [] } = response || {};
      setPrsData(data);
    }
  }

  function handleTabChange(event, newTab) {
    setTab(newTab);
  }

  return (
    <Box textAlign="center">
      <Typography variant="h5">PRs Merged Since</Typography>
      <Box
        alignItems="center"
        border={`1px solid ${grey[300]}`}
        borderRadius={4}
        display="flex"
        flexDirection="column"
        p={2}
        my={2}
      >
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          margin="auto"
          width={1}
        >
          <Box display="flex" m={1}>
            <TextField
              name="owner"
              variant="outlined"
              label="Owner"
              placeholder="Enter User/Owner"
              value={urlData.owner}
              onChange={handleChange}
              autoFocus
            />
          </Box>
          <Box display="flex" m={1}>
            <TextField
              name="repository"
              variant="outlined"
              label="Repository"
              placeholder="Enter Repository"
              value={urlData.repository}
              onChange={handleChange}
              autoFocus
            />
          </Box>
          <Box display="flex" m={1}>
            <TextField
              name="baseBrach"
              variant="outlined"
              label="Base Branch"
              placeholder="Enter Base Branch"
              value={urlData.baseBrach}
              onChange={handleChange}
              autoFocus
            />
          </Box>
        </Box>
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-around"
          mt={2}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="baseline"
            mx={2}
          >
            <Box mr={1}>
              <Typography variant="subtitle2">Repo Type</Typography>
            </Box>
            <ToggleButtonGroup
              color="secondary"
              size="small"
              value={repoType}
              onChange={handleRepoTypeChange}
              exclusive
            >
              <ToggleButton value="public" className={styles.toggleButton}>
                Public
              </ToggleButton>
              <ToggleButton value="private" className={styles.toggleButton}>
                Private
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="baseline"
            mx={2}
          >
            <Box mr={1}>
              <Typography variant="subtitle2">Status</Typography>
            </Box>
            <ToggleButtonGroup
              color="secondary"
              size="small"
              value={prState}
              onChange={handlePrStateChange}
              exclusive
            >
              <ToggleButton value="open" className={styles.toggleButton}>
                Open
              </ToggleButton>
              <ToggleButton value="closed" className={styles.toggleButton}>
                Closed
              </ToggleButton>
              <ToggleButton value="all" className={styles.toggleButton}>
                All
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Box>
      <Box my={1}>
        <Button variant="contained" color="secondary" onClick={getData}>
          Get Data
        </Button>
      </Box>
      {loading && <LinearProgress color="primary" />}
      {!isEmpty(prsData) && !loading && (
        <>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label="Prs List" value="prs-list" />
            <Tab label="Prs Links" value="prs-links" />
          </Tabs>
          <Divider />
          <Box my={1}>
            <CopyToClipboard text={prsLinks}>
              <Button variant="outlined">Copy Links</Button>
            </CopyToClipboard>
          </Box>
          <Box bgcolor={grey[50]} borderRadius={5} boxShadow={3} my={2} p={2}>
            <Virtuoso
              style={{ height: 500 }}
              totalCount={prsData.length}
              itemContent={index => (
                <RenderItem type={tab} data={prsData[index]} />
              )}
            />
          </Box>
        </>
      )}
    </Box>
  );
}

function RenderItem({ data, type, prsLinks }) {
  const {
    number,
    title,
    html_url: htmlUrl,
    user: { login },
  } = data;

  function handleClickOnPr({ url }) {
    window.open(url, '_blank');
  }

  return (
    <>
      {type === 'prs-list' && (
        <Box
          key={number}
          alignItems="center"
          bgcolor={grey[200]}
          borderRadius={5}
          display="flex"
          justifyContent="space-between"
          my={1}
          p={1}
        >
          <Typography variant="subtitle2">{title}</Typography>
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <Chip label={login} />
            </Box>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleClickOnPr({ url: htmlUrl })}
            >
              {number}
            </Button>
          </Box>
        </Box>
      )}
      {type === 'prs-links' && (
        <List key={number} disablePadding>
          <ListItem style={{ borderBottom: `1px solid ${grey[300]}` }}>
            <Typography variant="caption">{htmlUrl}</Typography>
          </ListItem>
        </List>
      )}
    </>
  );
}

RenderItem.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string,
  prsLinks: PropTypes.array,
};

export default App;
