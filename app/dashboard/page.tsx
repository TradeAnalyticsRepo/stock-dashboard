import Header from "@/components/Header";
import StatCard from "@/components/ui/StatCard";
import { Activity } from "lucide-react";

export default function Dashboard() {
  return (
    <div className='min-h-screen bg-black text-white'>
      <Header chartType='rechart' />

      <main className='max-w-7xl mx-auto p-6'>
        {/* 주요 지표 섹션 */}
        <section className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <StatCard
            title='현재가'
            value={`₩10000`}
            change={0.54}
            icon={Activity}
            color='text-red-600'
          />
          <StatCard
            title='현재가'
            value={`₩10000`}
            change={0.54}
            icon={Activity}
            color='text-red-600'
          />
          <StatCard
            title='현재가'
            value={`₩10000`}
            change={0.54}
            icon={Activity}
            color='text-red-600'
          />
          <StatCard
            title='현재가'
            value={`₩10000`}
            change={0.54}
            icon={Activity}
            color='text-red-600'
          />
          <StatCard
            title='현재가'
            value={`₩10000`}
            change={0.54}
            icon={Activity}
            color='text-red-600'
          />
          <StatCard
            title='현재가'
            value={`₩10000`}
            change={0.54}
            icon={Activity}
            color='text-red-600'
          />
          <StatCard
            title='현재가'
            value={`₩10000`}
            change={0.54}
            icon={Activity}
            color='text-red-600'
          />
          <StatCard
            title='현재가'
            value={`₩10000`}
            change={0.54}
            icon={Activity}
            color='text-red-600'
          />

          <StatCard
            title='현재가'
            value={`₩10000`}
            change={0.54}
            icon={Activity}
            color='text-red-600'
          />
          <StatCard
            title='현재가'
            value={`₩10000`}
            change={0.54}
            icon={Activity}
            color='text-red-600'
          />
        </section>
      </main>
    </div>
  );
}
