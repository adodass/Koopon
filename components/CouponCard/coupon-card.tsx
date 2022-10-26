import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/router"

interface IProps {
  data: {
    media: string;
    description: string;
    title: string;
    ownerId: string;
  },
  discount: string;
  is_minted: string;
  expiry_date: string;
  start_date: string;
  _id: string;
}


function CouponCard(props: IProps) {
  const { 
    data: { media, description, title, ownerId }, 
    discount, 
    is_minted,
   } = props;

   const router = useRouter();


  function saveToLocalStorage() {
    if(!is_minted) {
      return alert('Coupon not minted!');
    }
    localStorage.setItem('data', JSON.stringify({
      ...props
    }));

    router.push(`/coupon/${props?._id}`)
  }

  return (
    <Link href={`/coupon/${props?._id}`} passHref={true}>
      <div onClick={saveToLocalStorage} className="col-span-full md:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-md border border-slate-200 overflow-hidden m-2 w-64 ml-4 cursor-pointer hover:scale-110 delay-150 duration-300 ease-in-out hover:m-0 hover:z-10 ">
        <div className="flex flex-col h-full">
          {/* Image */}
          <div className="relative">
           {
            // eslint-disable-next-line @next/next/no-img-element
            <img src={media} alt="" className="h-56 object-cover w-full"/>
           }
            {/* Like button */}
            <button className="absolute top-0 right-0 mt-4 mr-4">
              <div className="text-slate-100 bg-slate-900 bg-opacity-60 rounded-full">
                <span className="sr-only">Like</span>
                <svg className="h-8 w-8 fill-current" viewBox="0 0 32 32">
                  <path d="M22.682 11.318A4.485 4.485 0 0019.5 10a4.377 4.377 0 00-3.5 1.707A4.383 4.383 0 0012.5 10a4.5 4.5 0 00-3.182 7.682L16 24l6.682-6.318a4.5 4.5 0 000-6.364zm-1.4 4.933L16 21.247l-5.285-5A2.5 2.5 0 0112.5 12c1.437 0 2.312.681 3.5 2.625C17.187 12.681 18.062 12 19.5 12a2.5 2.5 0 011.785 4.251h-.003z" />
                </svg>
              </div>
            </button>
          </div>
          {/* Card Content */}
          <div className="grow flex flex-col p-5">
            {/* Card body */}
            <div className="grow">
              <header className="mb-2">
                <div>
                  <h3 className="text-lg text-slate-800 font-semibold mb-1">{title?.toUpperCase()}</h3>
                </div>
                {
                  description &&
                   <div title={description} className="text-sm text-gray-400">{ description.length > 20 ? description.slice(0, 20) + "..." : description}</div>
                }
              </header>
            </div>
            {/* Rating and price */}
            <div className="flex flex-wrap justify-between items-center">
              {/* Rating */}
              <div className="flex items-center space-x-2 mr-2">
                <div className="inline-flex text-xs font-medium text-amber-600 py-1">Owner: {ownerId.length > 10 ? ownerId.slice(0, ownerId.length) : ownerId}</div>
              </div>
              {/* Price */}
              <div>
                <div className="inline-flex text-sm font-medium bg-emerald-100 text-emerald-600 rounded-md text-center px-2 py-0.5">discount: {discount}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}


export default CouponCard