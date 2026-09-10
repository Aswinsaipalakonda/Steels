import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryGridSection } from '../components/home/CategoryGridSection';
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection';
import { WhyChooseUsSection } from '../components/home/WhyChooseUsSection';
import { IndustriesSection } from '../components/home/IndustriesSection';
import { StatsSection } from '../components/home/StatsSection';
import { FinalCTASection } from '../components/home/FinalCTASection';
import api from '../lib/api';
import { Category, Product, HeroSlide } from '../types';

export const HomePage: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slidesRes, categoriesRes, productsRes]: any = await Promise.all([
          api.get('/hero-slides'),
          api.get('/categories'),
          api.get('/products?featured=true&limit=6'),
        ]);

        if (slidesRes.data) setSlides(slidesRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (productsRes.data) setFeaturedProducts(productsRes.data);
      } catch (err) {
        console.warn('Using fallback data on home page:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <HeroSection slides={slides} />
      <CategoryGridSection categories={categories} />
      <FeaturedProductsSection products={featuredProducts} />
      <WhyChooseUsSection />
      <IndustriesSection />
      <StatsSection />
      <FinalCTASection />
    </div>
  );
};
