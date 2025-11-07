import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Container } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCronLogs } from '../redux/actions/user.action';
import PageHeader from '../components/PageHeader';
import LogsTable from '../components/LogsTable';

export default function LogsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cronlogs, loading, error } = useSelector((state) => state.cronlogs);

  useEffect(() => {
    dispatch(fetchCronLogs());
  }, [dispatch]);

  const handleViewLog = (log) => {
    navigate('/dashboard/log-details', {
      state: {
        logId: log.id,
        created: log.createdAt,
        usersAffected: log.contacts?.length || 0
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader title="SYSTEM LOGS" />

      <LogsTable
        logs={cronlogs}
        loading={loading}
        page={0}
        rowsPerPage={cronlogs.length}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        onViewLog={handleViewLog}
      />
    </Container>
  );
}