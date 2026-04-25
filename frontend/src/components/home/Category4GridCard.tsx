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
    <div className="bg-white p-5 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-200">
      <div>
        <h2 className="text-[21px] font-bold text-[#0F1111] mb-2 leading-tight h-[54px] line-clamp-2">
          {data.title}
        </h2>

        <div className="grid grid-cols-2 gap-x-2 gap-y-4">
          {data.items.map((item) => (
            <Link href={item.link} key={item.id} className="group/item flex flex-col cursor-pointer">
              <div className="relative aspect-square w-full overflow-hidden bg-white">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover/item:scale-110"
                />
              </div>

              <p className="text-[12px] text-[#0F1111] mt-1 font-medium leading-tight h-8 line-clamp-2 group-hover/item:text-[#C7511F]">
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {data.footerLink && (
        <Link
          href={data.footerLink.url}
          className="text-[13px] text-[#007185] font-medium pt-4 hover:text-[#C7511F] hover:underline"
        >
          {data.footerLink.text}
        </Link>
      )}
    </div>
  );
}