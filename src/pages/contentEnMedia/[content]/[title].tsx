import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import { Video, getVideo, getAllVideos } from '../../api/videos'; // Adjust the import path as needed
import { Container } from '@/components/Container';

type Props = {
  video: Video | null;
};

const VideoDetail = ({ video }: Props) => {
  const router = useRouter();

  // If the page has not yet generated, this will be displayed initially
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found</div>;
  }

    // Function to transform YouTube URL to embed URL
    const transformYouTubeUrl = (url: string) => {
        if (url.includes('youtube.com/watch?v=')) {
          return url.replace('youtube.com/watch?v=', 'youtube.com/embed/');
        }
        return url;
      };
    
      const embedUrl = transformYouTubeUrl(video.vid_url);

  return (
    <Container>
    <div>
    <h2 className="text-center p-10 text-2xl font-bold tracking-tight text-zinc-800 sm:text-4xl mb-5">
        {video.titel}
    </h2>
    <div className="relative w-full pt-[56.25%]">
      <iframe 
        className="absolute top-0 left-0 w-full h-full"
        src={embedUrl} 
        title={video.titel} 
        allowFullScreen
      ></iframe>
    </div>
      <p className="mt-6 text-md">{video.beschrijving}</p>
    </div>
    </Container>
  );
};

export default VideoDetail;

export const getStaticProps: GetStaticProps<Props> = async (params: any) => {
  const video = await getVideo(params?.title as string);

  if (video == null) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      video,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const videos = await getAllVideos();
  const paths = videos.map(video => ({
    params: { content: 'video', title: video.titel },
  }));

  // This example uses fallback: 'blocking'. You can change this to 'false' or 'true' as needed.
  return { paths, fallback: 'blocking' };
};