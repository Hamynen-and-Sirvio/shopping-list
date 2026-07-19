import { PulseLoader } from 'react-spinners'
import './Loading.css'

const Loading = () => (
  <div className="loading-banner">
    <div className="loading-content">
      <PulseLoader
        size={6}
        speedMultiplier={0.6}
        color="var(--text-contrast)"
      />
      <span>Loading ...</span>
    </div>
  </div>
)

export default Loading
