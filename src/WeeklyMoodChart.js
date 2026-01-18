import React from "react";


export default function WeeklyMoodChart({ entries }) {
const last7 = Object.values(entries)
.filter(e => Date.now() - e.time < 7 * 24 * 60 * 60 * 1000);


const counts = last7.reduce((acc, e) => {
acc[e.mood] = (acc[e.mood] || 0) + 1;
return acc;
}, {});


return (
<div>
<h4>Last 7 Days</h4>
{Object.keys(counts).map(mood => (
<div key={mood} style={{marginBottom:8}}>
<strong>{mood}</strong>
<div style={{
background:"#7c3aed",
height:10,
width: `${counts[mood] * 30}px`
}} />
</div>
))}
</div>
);
}
