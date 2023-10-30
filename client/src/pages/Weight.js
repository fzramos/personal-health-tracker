import WeightForm from '../components/shared/WeightForm';
import WeightTable from '../components/shared/WeightTable';
import WeightCharts from '../components/shared/WeightCharts';

export default function Weight(props) {
  return (
    <>
      <WeightForm></WeightForm>
      <WeightCharts></WeightCharts>
      {/* <WeightTable></WeightTable> */}
    </>
  );
}
