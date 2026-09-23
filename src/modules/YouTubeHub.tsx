import { useState } from 'react';
import { Youtube, Search, ExternalLink } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { youtubeVideos } from '@/data/content';

export function YouTubeHub() {
  const { accent } = useApp();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const accentVideos = youtubeVideos.filter((v) => v.accent === accent);
  const [activeVideo, setActiveVideo] = useState(accentVideos[0] ?? youtubeVideos[0]);

  const categories = ['All', ...Array.from(new Set(accentVideos.map((v) => v.category)))];

  const filtered = accentVideos.filter((v) => {
    const matchSearch =
      !search ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.channel.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeFilter === 'All' || v.category === activeFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <PageHeader
        title="Curated YouTube Accent Hub"
        description="Embedded native video tutorials for American & British accents, shadowing drills, and real conversations."
        icon={<Youtube className="w-7 h-7 text-zinc-400" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video player */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.videoId}`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-black mb-1">{activeVideo.title}</h2>
                  <p className="text-sm text-zinc-500">{activeVideo.channel}</p>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-semibold hover:bg-zinc-50 hover:border-zinc-400 transition-colors shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Watch on YouTube</span>
                  <span className="sm:hidden">YouTube</span>
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* Video list */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Category filter tags */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === cat
                    ? 'bg-black text-white'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
            <span>{accent === 'american' ? '🇺🇸 American' : '🇬🇧 British'} Videos</span>
            <span className="text-zinc-300">({filtered.length})</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((video) => (
              <Card
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className={`p-3 ${activeVideo.id === video.id ? 'border-black ring-1 ring-black' : ''}`}
              >
                <div className="flex gap-3">
                  <div className="w-24 h-14 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-black line-clamp-2">{video.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{video.channel}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-zinc-400">{video.category}</span>
                      <a
                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-0.5 text-xs font-semibold text-zinc-500 hover:text-black"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-zinc-400 text-center py-8">No videos found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
