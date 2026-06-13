import { PulseLoader } from 'react-spinners'
import './Loading.css'

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <PulseLoader color="#f9f9f9" speedMultiplier={0.5} size={8} />
      </div>
    </div>
  )
}

export default Loading
