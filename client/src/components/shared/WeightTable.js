import { useEffect, useContext } from 'react';
import Table from 'react-bootstrap/Table';
import WeightContext from './WeightContext';
import Row from 'react-bootstrap/Row';

export default function WeightTable(props) {
  const { refreshWeightRecords, weightRecords } = useContext(WeightContext);

  useEffect(() => {
    refreshWeightRecords();
  }, []);

  const tableRows = weightRecords.map((elem) => {
    return (
      <tr key={elem._id}>
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
