'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ImageItem {
	src: string;
	alt?: string;
	project?: any; // Optional project association
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect max 7 images */
	images: ImageItem[];
	onProjectClick?: (project: any) => void;
}

export function ZoomParallax({ images, onProjectClick }: ZoomParallaxProps) {
	const container = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[180vh] md:h-[240vh]">
			<div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
				{images.map(({ src, alt, project }, index) => {
					const scale = scales[index % scales.length];
					const isInteractive = !!project;

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[15vh] md:[&>div]:!-top-[30vh] [&>div]:!left-[6vw] md:[&>div]:!left-[5vw] [&>div]:!h-[15vh] md:[&>div]:!h-[30vh] [&>div]:!w-[32vw] md:[&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[8vh] md:[&>div]:!-top-[10vh] [&>div]:!-left-[18vw] md:[&>div]:!-left-[25vw] [&>div]:!h-[18vh] md:[&>div]:!h-[45vh] [&>div]:!w-[24vw] md:[&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[20vw] md:[&>div]:!left-[27.5vw] [&>div]:!h-[14vh] md:[&>div]:!h-[25vh] [&>div]:!w-[20vw] md:[&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[15vh] md:[&>div]:!top-[27.5vh] [&>div]:!left-[6vw] md:[&>div]:!left-[5vw] [&>div]:!h-[14vh] md:[&>div]:!h-[25vh] [&>div]:!w-[22vw] md:[&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[15vh] md:[&>div]:!top-[27.5vh] [&>div]:!-left-[18vw] md:[&>div]:!-left-[22.5vw] [&>div]:!h-[15vh] md:[&>div]:!h-[25vh] [&>div]:!w-[25vw] md:[&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[12vh] md:[&>div]:!top-[22.5vh] [&>div]:!left-[18vw] md:[&>div]:!left-[25vw] [&>div]:!h-[10vh] md:[&>div]:!h-[15vh] [&>div]:!w-[14vw] md:[&>div]:!w-[15vw]' : ''} `}
						>
							<div 
								onClick={() => isInteractive && onProjectClick?.(project)}
								className={`relative h-[20vh] w-[45vw] sm:h-[25vh] sm:w-[25vw] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-md group transition-all duration-300 ${isInteractive ? 'cursor-pointer hover:shadow-xl hover:border-brand-blue/30' : 'pointer-events-none'}`}
							>
								<img
									src={src || '/placeholder.svg'}
									alt={alt || `Parallax image ${index + 1}`}
									referrerPolicy="no-referrer"
									className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
								/>
								
								{/* Hover Content Panel for Curated Work Case Studies */}
								{isInteractive && (
									<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6 text-left pointer-events-none">
										<span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue mb-1">
											{project.category}
										</span>
										<h4 className="text-white font-sans font-bold text-sm md:text-lg tracking-tight flex items-center gap-1.5">
											{project.title}
											<ArrowUpRight className="w-4 h-4 text-brand-blue shrink-0" />
										</h4>
										<p className="text-neutral-300 font-sans text-[10px] md:text-xs mt-1 line-clamp-2 leading-relaxed">
											{project.description}
										</p>
									</div>
								)}
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
