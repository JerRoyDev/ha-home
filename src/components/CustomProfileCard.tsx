import React from 'react';
import { useEntity } from '@hakit/core';
import type { EntityName } from '@hakit/core';

interface CustomProfileCardProps {
  name: string;
  avatarUrl: string;
  batteryEntity: EntityName;
  locationEntity: EntityName;
}

const CustomProfileCard: React.FC<CustomProfileCardProps> = ({
  name,
  avatarUrl,
  batteryEntity,
  locationEntity,
}) => {
  const battery = useEntity(batteryEntity);
  const location = useEntity(locationEntity);

  return (
    <div className="custom-profile-card bg-white shadow-md rounded-lg p-4 text-center">
      <img
        src={avatarUrl}
        alt={`${name}'s avatar`}
        className="w-20 h-20 rounded-full mx-auto"
        onError={(e) => {
          e.currentTarget.src = '/images/default-avatar.png';
        }}
      />
      <h2 className="text-xl font-semibold mt-2">{name}</h2>
      <p className="text-gray-600">Battery: {battery?.state || 'N/A'}%</p>
      <p className="text-gray-600">Location: {location?.state || 'Unknown'}</p>
    </div>
  );
};

export default CustomProfileCard;