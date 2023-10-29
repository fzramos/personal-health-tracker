import { useEffect, useContext } from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import { useQuery } from '@tanstack/react-query';
import { getWeightRecords } from '../../services/api';

export default function WeightTable(props) {
  const weightRecordsQuery = useQuery({
    queryKey: ['weightRecords'],
    queryFn: getWeightRecords,
  });

  if (weightRecordsQuery.isLoading) {
    return <h1>Loading table</h1>;
  }

  if (weightRecordsQuery.isError) {
    return (
      <>
        <h1>Error loading weight records table</h1>
        <p>{weightRecordsQuery.error}</p>
      </>
    );
  }

  const tableRows = weightRecordsQuery.data.map((elem) => {
    return (
      <tr id={elem._id} key={elem._id}>
        <td>{elem.subject}</td>
        <td>{elem.weight}</td>
        <td>{elem.unit}</td>
        <td>{elem.weightDate}</td>
      </tr>
    );
  });

  return (
    <Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Weight</th>
            <th>Unit</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    </Row>
  );
}
