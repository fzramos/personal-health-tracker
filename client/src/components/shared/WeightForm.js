import Button from 'react-bootstrap/Button';
import api from '../../services/api';
import { useEffect, useState, useContext } from 'react';
import AuthContext from './AuthContext';
// import WeightContext from './WeightContext';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import _ from 'lodash';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWeightRecords, postWeightRecord } from '../../services/api';

export default function WeightForm(props) {
  const queryClient = useQueryClient();
  // TODO: REMOVE THIS
  // const { refreshWeightRecords, weightRecords } = useContext(WeightContext);
  const { user } = useContext(AuthContext);

  // useEffect(() => {
  //   refreshWeightRecords();
  // }, []);

  const [selectedSubject, setSelectedSubject] = useState(user.subjects[0]);

  const weightRecordsQuery = useQuery({
    queryKey: ['weightRecords'],
    queryFn: getWeightRecords,
    placeholderData: [
      {
        _id: '0',
        weight: 150,
        unit: 'pounds',
        subject: 'Frank',
        userId: '0',
        weightDate: '2023-09-19T05:00:00.000Z',
      },
    ],
  });

  const weightRecordMutation = useMutation({
    mutationFn: postWeightRecord,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['weightRecords'], { exact: true });
      // if there's ever weight entry individual pages, could also
      queryClient.setQueryData(['weightRecords', data.id], data);
      // to add post results to the cache RIGHT away
    },
  });

  const getFormWeightDefault = (subject) => {
    // default weight in form will be latest weight of first subject
    // TODO do a weight useQUERY here to get weightRecords (will pull from cache)
    let subject1WeightRecords = _.filter(
      weightRecordsQuery.data,
      (o) => o.subject === subject
    );
    let latestSubject1Weight;
    if (subject1WeightRecords.length > 0) {
      subject1WeightRecords = _.sortBy(
        subject1WeightRecords,
        (o) => o.weightDate
      );
      latestSubject1Weight = subject1WeightRecords.reverse()[0]['weight'];
    } else {
      latestSubject1Weight = 150;
    }
    return latestSubject1Weight;
  };

  const [selectedWeight, setSelectedWeight] = useState(
    getFormWeightDefault(selectedSubject)
  );
  const [selectedWeightUnits, setSelectedWeightUnits] = useState('pounds');
  const [formNote, setFormNote] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        weight: selectedWeight,
        unit: selectedWeightUnits,
        subject: selectedSubject,
      };
      // TODO: useMutation and invalidate WEIGHT
      weightRecordMutation.mutate(payload);
      // await api.post('/api/weight', payload, { withCredentials: true });
      // moving default subject on form to next available subject if they exist
      const currentSubjectIndex = user.subjects.indexOf(selectedSubject);
      const newSubjectIndex = (currentSubjectIndex + 1) % user.subjects.length;
      setSelectedSubject(user.subjects[newSubjectIndex]);
      setSelectedWeight(getFormWeightDefault(user.subjects[newSubjectIndex]));
      // TODO: delete this since it will be handled by useMutation validate
      // await refreshWeightRecords();
    } catch (error) {
      const error_message = error.response.data;
      console.log(error_message);
      // maybe flash popup for error?
    }
  };

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        style={{ margin: 'auto', maxWidth: '1000px' }}
      >
        <Row className="align-items-center">
          <Col xs="auto">
            <Form.Group controlId="formSelectSubject">
              <Form.Label>Select Subject</Form.Label>
              <Form.Select
                value={selectedSubject}
                onChange={(e) => {
                  console.log('onchange ' + e.currentTarget.value);
                  setSelectedSubject(e.currentTarget.value);
                  console.log(
                    'onchange ' + getFormWeightDefault(e.currentTarget.value)
                  );
                  setSelectedWeight(
                    getFormWeightDefault(e.currentTarget.value)
                  );
                }}
              >
                {user.subjects.map((val, i) => {
                  return (
                    <option key={i} value={val}>
                      {val}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs="auto">
            <Form.Group controlId="formWeight">
              <Form.Label>Weight entry</Form.Label>
              {/* UPDATE placeholder with latest weight for the selected subject */}
              <Form.Control
                type="number"
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs="auto">
            <Form.Group controlId="formWeightUnits">
              <Form.Label>Select Units</Form.Label>
              <Form.Select
                value={selectedWeightUnits}
                onChange={(e) => setSelectedWeightUnits(e.currentTarget.value)}
              >
                <option value="pounds">lbs</option>
                <option value="kilograms">kg</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs="auto">
            <Form.Group controlId="formNote">
              <Form.Label>Note (Optional)</Form.Label>
              <Form.Control
                type="text"
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col xs="auto">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
