import { PropagateLoader } from 'react-spinners'
import './Loading.css'

const Loading = () => {
  return (
    <div className="loading-container">
      <PropagateLoader color="#f9f9f9" size={10} />
    </div>
  )
}

export default Loading
