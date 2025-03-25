import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { sessionService } from '../../services/studyServices';
import { StudySession } from '../../services/types';

const StudySessionList: React.FC = () => {
  const { data: sessions, isLoading, error } = useQuery<StudySession[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      const response = await sessionService.getSessions();
      return response.data;
    },
  });

  if (isLoading) return <div>Loading sessions...</div>;
  if (error) return <div>Error loading sessions</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Study Sessions</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions?.map((session) => (
          <div key={session.id} className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold">{session.subject}</h3>
            <p className="text-gray-600">{session.topic}</p>
            <div className="mt-2">
              <p>Duration: {session.duration} minutes</p>
              <p>Status: {session.status}</p>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <p>Started: {new Date(session.startTime).toLocaleString()}</p>
              <p>Ended: {new Date(session.endTime).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudySessionList; 