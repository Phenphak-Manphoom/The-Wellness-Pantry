import React from "react";
import { Helmet } from "react-helmet";

const MetaData = ({ title }) => {
  return (
    <Helmet>
      <title>{`${title} - The Wellness Pantry`}</title>
    </Helmet>
  );
};
export default MetaData;

/**
 *  const SEO = ({ title, description, image, url }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );

  import SEO from "../components/SEO";

const About = () => {
  return (
    <>
      <SEO
        title="About Us - The Wellness Pantry"
        description="Learn more about The Wellness Pantry, your go-to store for healthy food options tailored to every lifestyle."
        image="/images/about-banner.jpg"
        url="https://www.thewellnesspantry.com/about"
      />
      <div>
        {/* Content ของหน้า About */
