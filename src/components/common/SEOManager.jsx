import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SEOManager = () => {
  const [seoData, setSeoData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Fetch all SEO data once
    const fetchSeo = async () => {
      try {
        const url = window.location.hostname === 'localhost' 
          ? 'http://localhost:8000/manage_seo.php' 
          : '/backend/manage_seo.php';
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          setSeoData(data);
        }
      } catch (err) {
        console.error('Failed to fetch SEO data:', err);
      }
    };
    fetchSeo();
  }, []);

  useEffect(() => {
    if (seoData.length === 0) return;

    // Find SEO record for current path
    const currentPath = location.pathname;
    let pageSeo = seoData.find(record => record.page_path === currentPath);

    // Fallback to '/' if no specific SEO is found for the path, or just use defaults
    if (!pageSeo) {
      pageSeo = seoData.find(record => record.page_path === '/');
    }

    if (pageSeo) {
      // Update Title
      if (pageSeo.title) {
        document.title = pageSeo.title;
        updateMetaTag('property', 'og:title', pageSeo.title);
        updateMetaTag('name', 'twitter:title', pageSeo.title);
      }

      // Update Description
      if (pageSeo.description) {
        updateMetaTag('name', 'description', pageSeo.description);
        updateMetaTag('property', 'og:description', pageSeo.description);
        updateMetaTag('name', 'twitter:description', pageSeo.description);
      }

      // Update Keywords
      if (pageSeo.keywords) {
        updateMetaTag('name', 'keywords', pageSeo.keywords);
      }

      // Update OG Image
      if (pageSeo.og_image) {
        const fullImageUrl = window.location.origin + pageSeo.og_image;
        updateMetaTag('property', 'og:image', fullImageUrl);
        updateMetaTag('name', 'twitter:image', fullImageUrl);
      }

      // Update Canonical URL
      if (pageSeo.canonical_url) {
        let link = document.querySelector("link[rel='canonical']");
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', 'canonical');
          document.head.appendChild(link);
        }
        link.setAttribute('href', pageSeo.canonical_url);
        updateMetaTag('property', 'og:url', pageSeo.canonical_url);
      } else {
        // Fallback canonical to current url
        updateMetaTag('property', 'og:url', window.location.href);
      }
    }
  }, [location.pathname, seoData]);

  const updateMetaTag = (attrName, attrValue, content) => {
    let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  return null; // This component doesn't render anything visually
};

export default SEOManager;
