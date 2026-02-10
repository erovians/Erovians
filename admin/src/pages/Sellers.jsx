import SellerTable from '../components/tables/SellerTable';
import { sellerData } from '../data/sellerData';

export default function Sellers() {
  return (
    <div className="p-6">
      <SellerTable data={sellerData} />
    </div>
  );
}