import Image from 'next/image';
import Link from 'next/link';

interface GridItem {
  id: string;
  name: string;
  image: string;
  link: string;
}

interface Category4GridCardProps {
  data: {
    title: string;
    items: GridItem[];
    footerLink?: { text: string; url: string; };
  };
}

export default function Category4GridCard({ data }: Category4GridCardProps) {
  return (
    <div className="bg-white p-5 shadow-md flex flex-col justify-between h-full group hover:shadow-xl transition-shadow duration-300">

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 h-[56px] line-clamp-2">{data.title}</h2>

        <div className="grid grid-cols-2 gap-x-3 gap-y-5">
          {data.items.map((item) => (
            <Link href={item.link} key={item.id} className="block group/item">
              <div className="relative aspect-square w-full mb-1 overflow-hidden rounded-sm bg-gray-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover/item:scale-105" 
                />
              </div>
              <p className="text-xs text-gray-700 font-medium group-hover/item:text-blue-700">{item.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {data.footerLink && (
        <Link href={data.footerLink.url} className="text-sm text-blue-600 font-medium pt-5 hover:text-orange-700 hover:underline">
          {data.footerLink.text}
        </Link>
      )}
    </div>
  );
}