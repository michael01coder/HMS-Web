import LinkPage from '../../components/crud/LinkPage';
import { HR_ONLY } from '../../config/roles';
import { R } from '../shared/entityKit';
export const HotelAmenities = () => <LinkPage title="Hotel amenities" sub="Link amenities to hotels." path="/hotelamenities" write={HR_ONLY} a={{ key: 'hotelId', label: 'Hotel', type: 'ref', ref: R.hotels }} b={{ key: 'amenityId', label: 'Amenity', type: 'ref', ref: R.amenities }} />;
export const RoomTypeAmenities = () => <LinkPage title="Room type amenities" sub="Link amenities to room types." path="/roomtypeamenities" write={HR_ONLY} a={{ key: 'roomTypeId', label: 'Room type', type: 'ref', ref: R.roomTypes }} b={{ key: 'amenityId', label: 'Amenity', type: 'ref', ref: R.amenities }} />;
