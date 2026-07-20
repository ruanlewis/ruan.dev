'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight, Compass, Grid3X3, Activity, Cpu, ArrowDown } from 'lucide-react';

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

	const scaleCenter = useTransform(scrollYProgress, [0, 1], [1, 7.5]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scaleCenter, scale5, scale6, scale5, scale6, scale8, scale9];

	const outerCardsOpacity = useTransform(scrollYProgress, [0.5, 0.85], [1, 0]);
	const projectOpacity = useTransform(scrollYProgress, [0.38, 0.7], [1, 0]);
	const specSheetOpacity = useTransform(scrollYProgress, [0.45, 0.78], [0, 1]);

	return (
		<div ref={container} className="relative h-[220dvh] md:h-[240vh]">
			<div className="sticky top-0 h-[100dvh] md:h-screen overflow-hidden flex items-center justify-center">
				{images.map(({ src, alt, project }, index) => {
					const scale = scales[index % scales.length];
					const isInteractive = !!project && index !== 0;

					return (
						<motion.div
							key={index}
							style={{ 
								scale,
								opacity: index === 0 ? 1 : outerCardsOpacity
							}}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[15vh] md:[&>div]:!-top-[30vh] [&>div]:!left-[6vw] md:[&>div]:!left-[5vw] [&>div]:!h-[15vh] md:[&>div]:!h-[30vh] [&>div]:!w-[32vw] md:[&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[8vh] md:[&>div]:!-top-[10vh] [&>div]:!-left-[18vw] md:[&>div]:!-left-[25vw] [&>div]:!h-[18vh] md:[&>div]:!h-[45vh] [&>div]:!w-[24vw] md:[&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[20vw] md:[&>div]:!left-[27.5vw] [&>div]:!h-[14vh] md:[&>div]:!h-[25vh] [&>div]:!w-[20vw] md:[&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[15vh] md:[&>div]:!top-[27.5vh] [&>div]:!left-[6vw] md:[&>div]:!left-[5vw] [&>div]:!h-[14vh] md:[&>div]:!h-[25vh] [&>div]:!w-[22vw] md:[&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[15vh] md:[&>div]:!top-[27.5vh] [&>div]:!-left-[18vw] md:[&>div]:!-left-[22.5vw] [&>div]:!h-[15vh] md:[&>div]:!h-[25vh] [&>div]:!w-[25vw] md:[&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[12vh] md:[&>div]:!top-[22.5vh] [&>div]:!left-[18vw] md:[&>div]:!left-[25vw] [&>div]:!h-[10vh] md:[&>div]:!h-[15vh] [&>div]:!w-[14vw] md:[&>div]:!w-[15vw]' : ''} `}
						>
							<div 
								onClick={() => isInteractive && onProjectClick?.(project)}
								className={`relative h-[20vh] w-[45vw] sm:h-[25vh] sm:w-[25vw] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-md group transition-all duration-300 pointer-events-auto ${isInteractive ? 'cursor-pointer hover:shadow-xl hover:border-brand-blue/30' : 'cursor-default'}`}
							>
								{index === 0 ? (
									<div className="w-full h-full relative bg-white dark:bg-[#0c0c0e] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none transition-colors duration-300">
										{/* CAD Grid Background */}
										<div className="absolute inset-0 opacity-10 dark:opacity-15 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
										
										{/* Highlight Glows */}
										<div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
										<div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#0066ff]/5 dark:bg-[#0066ff]/10 rounded-full blur-3xl pointer-events-none" />

										{/* Content Area - Scroll indicator with arrow */}
										<div className="flex-1 flex flex-col justify-center items-center text-center pt-1 pb-1 z-10 space-y-2.5 sm:space-y-3.5">
											<h3 className="font-sans font-extrabold text-base sm:text-lg md:text-xl text-neutral-900 dark:text-white tracking-tighter uppercase">
												Scroll Down
											</h3>

											{/* Bouncing Arrow Element */}
											<motion.div
												animate={{ y: [0, 4, 0] }}
												transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
												className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-[#0066ff] shadow-xs"
											>
												<ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
											</motion.div>

											<p className="font-sans text-[9px] sm:text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 max-w-[180px] sm:max-w-[210px] leading-snug">
												to continue to the design specification sheets
											</p>
										</div>

										{/* Bottom live stats mockup */}
										<div className="flex justify-between items-center pt-2.5 border-t border-neutral-150 dark:border-neutral-800/60 z-10 shrink-0 font-mono text-[7px] sm:text-[8px] text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
											<span>ruan.dev // CALIBRATION</span>
											<span className="text-[#0066ff] font-bold animate-pulse">● READY</span>
										</div>
									</div>
								) : (
									<img
										src={src || '/placeholder.svg'}
										alt={alt || `Parallax image ${index + 1}`}
										referrerPolicy="no-referrer"
										className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
									/>
								)}
								
								{/* Hover Content Panel for Curated Work Case Studies */}
								{isInteractive && (
									<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6 text-left pointer-events-none">
										<>
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
										</>
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
