import React from 'react';

const OpportunityList = ({ opportunities }) => {
  if (!Array.isArray(opportunities) || opportunities.length === 0) {
    return <p>No opportunities found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Solicitation Number</th>
          <th>Publish Date</th>
          <th>Response Date</th>
          <th>Organization</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {opportunities.map(opportunity => (
          <tr key={opportunity.id}>
            <td>{opportunity.title}</td>
            <td>{opportunity.solicitationNumber}</td>
            <td>{new Date(opportunity.publishDate).toLocaleString()}</td>
            <td>{new Date(opportunity.responseDate).toLocaleString()}</td>
            <td>{opportunity.organization}</td>
            <td>{opportunity.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OpportunityList;
