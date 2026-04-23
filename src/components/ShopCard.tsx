import React from 'react';
import { Shop } from '@/data/mock-data';
import { Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const ShopCard = ({ shop }: { shop: Shop }) => {
    return (
        <Link href={`/shop/${shop.id}`}>
            <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700/50 group h-full flex flex-col"
            >
                <div className="h-44 w-full overflow-hidden relative isolate">
                    <img
                        src={shop.image}
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl flex items-center gap-1.5 font-bold text-sm text-slate-800 shadow-lg">
                            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                            {shop.rating}
                        </div>

                        <div className="bg-[#121212]/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl flex items-center gap-1.5 font-bold text-sm text-white shadow-lg">
                            <Clock className="w-4 h-4 text-orange-400" />
                            {shop.deliveryTime}
                        </div>
                    </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-xl mb-1 text-slate-800 dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors">
                        {shop.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                        {shop.tags.join(' • ')}
                    </p>
                    <div className="mt-auto">
                        <div className="inline-block px-3 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 text-xs font-bold rounded-xl border border-orange-100 dark:border-orange-500/20">
                            Free Delivery Available
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};
