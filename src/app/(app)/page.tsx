import NewLetter from "@/components/Newletter";
import { db } from "@/server/db"
import { ArrowUpRight, Facebook, Github, Instagram } from 'lucide-react';
import Link from "next/link";

export async function generateMetadata(): Promise<any> {
  try {
    const settings: any = await db.setting.findMany({});
    const title = settings.find((v: any) => v.key === "home-title")?.value || "Home";
    const description = settings.find((v: any) => v.key === "home-text")?.value || "Welcome to the blog.";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: baseUrl,
        type: "website",
        images: [
          {
            url: settings.find((v: any) => v.key === "home-og-image")?.value ||
              settings.find((v: any) => v.key === "home-og-banner")?.value ||
              "",
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [
          settings.find((v: any) => v.key === "home-og-image")?.value ||
          settings.find((v: any) => v.key === "home-og-banner")?.value ||
          "",
        ],
      },
      alternates: {
        canonical: baseUrl,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Home",
      description: "Welcome to the blog.",
      openGraph: {
        title: "Home",
        description: "Welcome to the blog.",
        url: process.env.NEXT_PUBLIC_BASE_URL || "",
        type: "website",
        images: [
          {
            url: "",
            alt: "Home",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Home",
        description: "Welcome to the blog.",
        images: [""],
      },
      alternates: {
        canonical: process.env.NEXT_PUBLIC_BASE_URL || "",
      },
    };
  }
}

const Page = async () => {

  const settings: any = await db.setting.findMany({})
  const settingsData: any = {
    me: settings.find((v: any) => v.key === "home-me").value || "",
    title: settings.find((v: any) => v.key === "home-title").value || "",
    text: settings.find((v: any) => v.key === "home-text").value || "",
    svg: settings.find((v: any) => v.key === "home-svg").value || "",
    banner: settings.find((v: any) => v.key === "home-banner").value || "",
    newsletter: settings.find((v: any) => v.key === "newsletter-title").value || "",
    socialTitle: settings.find((v: any) => v.key === "social-title").value || "",
    socialText: settings.find((v: any) => v.key === "social-text").value || "",
    facebook: settings.find((v: any) => v.key === "social-face-url").value || "",
    github: settings.find((v: any) => v.key === "social-git-url").value || "",
    instagram: settings.find((v: any) => v.key === "social-inst-url").value || "",
    mainPostId: settings.find((v: any) => v.key === "main-post").value || "",
    siteUrl: settings.find((v: any) => v.key === "my-site").value || "",
    siteName: settings.find((v: any) => v.key === "my-site-text").value || "",
  }

  const mainPostId = Number(settingsData.mainPostId) || 1
  const posts = await db.post.findMany({
    take: 20,
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      bannerUrl: {
        not: null,
      },
      id: {
        not: mainPostId
      }
    },
  })

  const mainPost = await db.post.findFirst({
    where: {
      id: mainPostId
    }
  })

  const dateTransformer = (publishDate: any) => new Date(publishDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })


  function truncateText(text: string, maxSize: number): string {
    if (text.length <= maxSize) return text;
    return text.slice(0, maxSize) + "...";
  }

  function formatWatchTime(seconds: number): string {
    if (!seconds || seconds <= 0) return ""
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    const parts = []
    if (h > 0) parts.push(`${h} h`)
    if (m > 0) parts.push(`${m} min`)
    if (s > 0) parts.push(`${s} second`)
    return parts.join(" ")
}


  return (
    <>
      <div className="w-full max-w-3xl lg:p-0 p-7 mx-auto lg:mt-20 lg:min-h-[50svh] flex flex-col justify-center ">
        <div className="flex items-center justify-start gap-2">
          <p className="font-light text-foreground/60">{settingsData.me}</p>
          <a
            href={settingsData.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary/5 border-primary/70 border text-primary decoration-0 px-2 rounded-full flex items-center justify-center gap-1 !text-sm"
          >
            {settingsData.siteName}
            <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="flex">
          <div className="lg:w-3/5">
            <h1 className="text-5xl lg:text-7xl font-extrabold">{settingsData.title}</h1>
            <p className="mt-4 text-foreground/60 font-extralight">{settingsData.text}</p>
          </div>
          <div className="w-2/5 hidden lg:flex items-center justify-center  translate-x-20 relative">
            <span
              className="scale-110 absolute blur-2xl opacity-30"
              dangerouslySetInnerHTML={{ __html: settingsData.svg }} />
            <span
              className="scale-110 absolute"
              dangerouslySetInnerHTML={{ __html: settingsData.svg }} />
          </div>
        </div>
      </div>
      <div className="p-5 -translate-x-3 my-10 lg:my-32 w-[110%] bg-foreground/5 -rotate-2 border-y text-foreground text-center font-semibold tracking-wide uppercase select-none pointer-events-none">
        {settingsData.banner}
      </div>

      {mainPost && (
        <div className="mx-5 lg:mx-0">
          <Link href={`/blog/${mainPost.slug}`} className="w-full max-w-5xl lg:border-l-2 border-primary lg:mx-auto mt-16 lg:mt-10 lg:mb-10 bg-secondary/30 grid grid-cols-1 lg:grid-cols-2 ">
            <div className="flex flex-col p-5 lg:p-10 lg:order-0 order-2">
              <div className="flex flex-wrap gap-2 my-2">
                {mainPost.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-accent/30 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium" >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-3xl font-bold">{mainPost.title}</h2>
              <p className="text-foreground/60 text-base">{mainPost.excerpt}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>
                  {dateTransformer(mainPost.createdAt)}
                </span>
                <span>• {mainPost.views} views</span>
                <span>• {formatWatchTime(mainPost.watchTime)}</span>
              </div>
            </div>
            {mainPost.bannerUrl && (
              <img
                src={mainPost.bannerUrl}
                alt={mainPost.title}
                className="h-full object-cover object-top-left"
              />
            )}
          </Link>
        </div>
      )}
      <div className="w-full max-w-5xl mx-auto my-14 lg:my-28 lg:border-b grid grid-cols-1 md:grid-cols-3 items-center">
        <div className="flex flex-col items-start col-span-2 p-6">
          <h3 className="text-xl mb-2">{settingsData.newsletter}</h3>
          <NewLetter />
        </div>
        <div className="flex flex-col items-start border-l p-6">
          <h3 className="text-xl  mb-2">{settingsData.socialTitle}</h3>
          <p className="text-muted-foreground text-sm">
            {settingsData.socialText}
          </p>
          <div className="flex gap-4 mt-4">
            {settingsData.github && (
              <a href={settingsData.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github />
              </a>
            )}
            {settingsData.instagram && (
              <a href={settingsData.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram />
              </a>
            )}
            {settingsData.facebook && (
              <a href={settingsData.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="mx-5 lg:mx-0">
        <div className="w-full max-w-6xl gap-5 lg:mx-auto my-10  grid lg:grid-cols-3  ">
          {posts.map((post) => <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={post.bannerUrl || ""}
              alt={post.title}
              className="object-cover object-top-left h-max lg:h-44 w-full"
            />
            <div className="w-full lg:border-l-2 border-primary h-full bg-secondary/30">
              <div className="flex flex-col p-5">
                <div className="flex flex-wrap gap-2 my-2">
                  {post.tags?.slice(0, 3).map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/tag/${tag}`}
                      className="bg-accent/30 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium hover:bg-accent/50 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
                <h2 className="text-2xl font-bold">{truncateText(post.title, 35)}</h2>
                <p className="text-foreground/60 text-base">{truncateText(post.excerpt, 60)}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span>
                    {dateTransformer(post.createdAt)}
                  </span>
                  <span>• {post.views} views</span>
                  <span>• {formatWatchTime(post.watchTime)}</span>
                </div>
              </div>
            </div>
          </Link>)}
        </div>
      </div>
    </>
  )
}

export default Page