export default function DetailSkeleton() {
  return (
    <div className="container mx-auto p-4 min-h-screen animate-pulse">
  
      <div className="h-10 bg-gray-800 w-24 mb-6 rounded-lg"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      
        <div className="bg-gray-800 rounded-2xl h-[400px] md:h-[500px] w-full"></div>

        <div className="space-y-6">
          <div className="h-10 bg-gray-800 rounded-lg w-3/4"></div> 
          <div className="h-6 bg-gray-800 rounded-lg w-1/4"></div>  

          <div className="space-y-3 pt-4"> 
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3"></div>
          </div>

          <div className="flex gap-4 pt-8"> 
            <div className="h-14 bg-gray-800 rounded-xl flex-1"></div>
            <div className="h-14 bg-gray-800 rounded-xl flex-1"></div>
          </div>

          <div className="pt-10 space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/3"></div>
            <div className="h-24 bg-gray-800 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}