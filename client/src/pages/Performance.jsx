import CategoryPieChart from "./components/CategoryPieChart"
import { useParams } from "react-router-dom";

function Performance() {

    const { id } = useParams();


  return (
    <div>
        <CategoryPieChart userId={id}/>
    </div>
  )
}


export default Performance;
