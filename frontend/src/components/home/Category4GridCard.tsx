import Image from 'next/image';
import Link from 'next/link';

interface GridItem {
  id?: string | number;
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
    <div className="bg-white p-4 sm:p-5 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-200">
      <div>
        <h2 className="text-sm sm:text-[21px] font-bold text-[#0F1111] mb-2 leading-tight h-[50px] sm:h-[54px] line-clamp-2">
          {data.title}
        </h2>

        <div
          className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
          {data.items.map((item, index) => (
            <Link
              href={item.link}
              key={item.id || index}
              className="group/item flex flex-col cursor-pointer">
              <div className="relative aspect-square w-full overflow-hidden bg-white rounded-sm">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 15vw"
                  className="object-cover transition-transform duration-300 group-hover/item:scale-110 group/item flex flex-col cursor-pointer"
                />
              </div>

              <p className="text-xs sm:text-[10px] md:text-[12px] text-[#0F1111] mt-1 font-medium leading-tight h-8 line-clamp-2 group-hover/item:text-[#C7511F]">
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {data.footerLink && (
        <Link
          href={data.footerLink.url}
          className="text-[12px] sm:text-[13px] text-[#007185] font-medium pt-4 hover:text-[#C7511F] hover:underline"
        >
          {data.footerLink.text}
        </Link>
      )}
    </div>
  );
}