import './largestKillingSpree.css';

function LargestKillingSpree({matchData}) {

  return (
    <div className="largestKillingSpreeContainer">
      {matchData.info.participants.map((value, index) =>
        <div className="killingSpreeValues" key={index}>{value.largestKillingSpree}</div>
      )}
    </div>
  )
}

export default LargestKillingSpree;