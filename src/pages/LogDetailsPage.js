import React, { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button as MuiButton } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCronLogDetails } from '../redux/actions/user.action';
import { notifyErrorFxn } from 'src/utils/toast-fxn';
import LogDetailsHeader from '../components/LogDetailsHeader';
import LogDetailsTable from '../components/LogDetailsTable';

export default function LogDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { logId, created, usersAffected } = location.state || {};
  const { currentLogDetails, loading, error, currentLogId } = useSelector((state) => state.cronlogs);

  useEffect(() => {
    if (!logId) {
      notifyErrorFxn("No log selected");
      navigate('/dashboard/logs');
      return;
    }

    dispatch(fetchCronLogDetails(logId));

    // Cleanup when component unmounts
    return () => {
      // Clear the log details when leaving the page
      // Note: This might not be necessary if navigation clears the state
    };
  }, [logId, dispatch, navigate]);

  const handleBackToLogs = () => {
    navigate('/dashboard/logs');
  };

  const handleViewUser = (user) => {
    notifyErrorFxn(`Viewing user: ${user.contactName || user.name}`);
  };

  if (!logId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <MuiButton
          variant="contained"
          onClick={handleBackToLogs}
          sx={{ mt: 2 }}
        >
          Back to Logs
        </MuiButton>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <LogDetailsHeader
        created={created}
        logId={logId}
        usersAffected={usersAffected}
        onBackToLogs={handleBackToLogs}
      />

      <LogDetailsTable
        logDetails={currentLogDetails}
        loading={loading}
        page={0}
        rowsPerPage={currentLogDetails.length}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        onViewUser={handleViewUser}
      />
    </Container>
  );
}