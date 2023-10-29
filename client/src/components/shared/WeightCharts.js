import React from 'react';
import AuthContext from './AuthContext';
import { getWeightRecords } from '../../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

const getColor = () => `rgba(255, 255, 255, 0.7)`; // Dark background color

export default function WeightCharts() {
  const { user } = useContext(AuthContext);

  const weightRecordsQuery = useQuery({
    queryKey: ['weightRecords'],
    queryFn: getWeightRecords,
  });

  if (weightRecordsQuery.isLoading) {
    return <h1>Loading charts</h1>;
  }

  if (weightRecordsQuery.isError) {
    return (
      <>
        <h1>Error loading charts</h1>
        <p>{weightRecordsQuery.error}</p>
      </>
    );
  }

  return (
    <div>
      {user.subjects.map((subject, index) => {
        // Filter data for the current subject
        const subjectData = weightRecordsQuery.data.filter(
          (item) => item.subject === subject
        );
        const minWeight = Math.min(...subjectData.map((item) => item.weight));
        const maxWeight = Math.max(...subjectData.map((item) => item.weight));

        const yAxisDomain = [minWeight - 10, maxWeight + 10];

        const xAxisFormatter = (value) => {
          return moment(value).format('YYYY-MM-DD');
        };

        return (
          <div key={index}>
            <h2>Subject {subject}</h2>
            <LineChart
              width={500}
              height={300}
              data={subjectData}
              margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weightDate" tickFormatter={xAxisFormatter} />
              <YAxis domain={yAxisDomain} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                name="weight"
                stroke={getColor()}
              />
            </LineChart>
          </div>
        );
      })}
    </div>
  );
}
