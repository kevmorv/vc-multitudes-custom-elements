// Example of a simple image slider element
// It uses Visual Composer shared asset library - slickSlider
// Component generates the markup of the slider,
// it stores the markup as a string inside a data attribute of a helper element .vcvhelper

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getService } from "vc-cake";

const vcvAPI = getService("api");

export default class ImageSlider extends vcvAPI.elementComponent {
  render() {
    const { id, atts, editor } = this.props;
    let {
      images,
      autoplay,
      autoplayDelay,
      effect,
      pointers,
      arrows,
      metaCustomId,
      customClass,
    } = atts;

    let containerClasses = "vce-image-slider";
    const wrapperClasses = "vce-image-slider-wrapper vce";
    const dotsClasses = "vce-image-slider-dots";
    const containerProps = {};

    if (typeof customClass === "string" && customClass) {
      containerClasses += ` ${customClass}`;
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId;
    }

    // Generate array of JSX of images
    const Slides = images.map((image, index) => {
      const customProps = {};
      const CustomTag = "div";
      let imgClasses = "vce-image-slider-img";
      const imgTagClasses = "";
      const imgSrc = this.getImageUrl(image); // This is the common method available for all elements
      const itemProps = {};

      customProps.style = { backgroundImage: `url(${imgSrc})` };

      if (image.filter && image.filter !== "normal") {
        imgClasses += ` vce-image-filter--${image.filter}`;
      }

      return (
        <div
          className="vce-image-slider-item vc-slick-item"
          key={`vce-image-slider-item-${index}-${id}`}
          {...itemProps}
        >
          <CustomTag {...customProps} className={imgClasses}>
            <img
              className={imgTagClasses}
              src={imgSrc}
              style={{ display: "none" }}
              alt={(image && image.alt) || ""}
            />
          </CustomTag>
        </div>
      );
    });

    const doAll = this.applyDO("all");

    autoplayDelay *= 1000;

    let prevArrow = "";
    let nextArrow = "";

    // Generate markup for Slick slider arrows
    if (arrows) {
      const arrowClasses = "vce-image-slider-arrow";

      prevArrow = (
        <div className={`${arrowClasses} vce-image-slider-prev-arrow`}>
          <svg width="16px" height="25px" viewBox="0 0 16 25">
            <polygon
              id="Prev-Arrow"
              points="12.3743687 5.68434189e-14 0 12.3743687 12.0208153 24.395184 14.1421356 22.2738636 4.31790889 12.4496369 14.5709572 2.19658855"
            />
          </svg>
        </div>
      );
      nextArrow = (
        <div className={`${arrowClasses} vce-image-slider-next-arrow`}>
          <svg width="16px" height="25px" viewBox="0 0 16 25">
            <polygon
              id="Next-Arrow"
              points="3.02081528 24.395184 15.395184 12.0208153 3.37436867 1.13686838e-13 1.25304833 2.12132034 11.0772751 11.9455471 0.824226734 22.1985954"
            />
          </svg>
        </div>
      );
    }

    // Compose the markup of the slider
    // Store slick settings in the data attributes
    const listHTML = (
      <div
        className="vce-image-slider-list"
        data-slick-autoplay={autoplay ? "on" : "off"}
        data-slick-autoplay-delay={`${autoplayDelay}`}
        data-slick-effect={effect}
        data-slick-dots={pointers ? "on" : "off"}
        data-slick-arrows={arrows ? "on" : "off"}
      >
        <div className="slick-list">
          {/* {prevArrow} */}
          <div className="slick-track">{Slides}</div>
          {/* {nextArrow} */}
        </div>
      </div>
    );

    // Generate raw HTML string to initiate on View Page
    let htmlString = renderToStaticMarkup(listHTML);
    htmlString += renderToStaticMarkup(<div className={dotsClasses} />);

    // Use .vcvhelper element to render slick slider in editor
    // Store raw HTML string inside data attribute to initiate it on View Page
    return (
      <div>
        <div className={containerClasses} {...editor} {...containerProps}>
          <div className={wrapperClasses} id={"el-" + id} {...doAll}>
            {/* <h1> Heelo world</h1> */}
            <div className="vcvhelper" data-vcvs-html={htmlString}>
              <div
                className="vce-image-slider-list"
                data-slick-autoplay={autoplay ? "on" : "off"}
                data-slick-autoplay-delay={autoplayDelay}
                data-slick-effect={effect}
                data-slick-disable-swipe="off"
                data-slick-dots={pointers ? "on" : "off"}
                data-slick-arrows={arrows ? "on" : "off"}
              >
                <div className="slick-list">
                  {/* {prevArrow} */}
                  <div className="slick-track">{Slides}</div>
                  {/* {nextArrow} */}
                </div>
              </div>
              <div className={dotsClasses} />
            </div>
          </div>
          <div className="arrows-containter">
            <button
              className={`vce-image-slider-prev-arrow`}
              aria-label="Go to previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="32"
                viewBox="0 0 17 32"
                fill="none"
              >
                <path
                  d="M16.1914 31.8073L0 22.4413V9.8499L16.1914 0.545898V7.92707L2.88747 15.4943V16.983L16.1914 24.6122V31.8073Z"
                  fill="#1A4434"
                />
              </svg>
            </button>{" "}
            <button
              className={`vce-image-slider-next-arrow`}
              aria-label="Go to next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="32"
                viewBox="0 0 17 32"
                fill="none"
              >
                <path
                  d="M4.64031e-06 0.545702L16.1914 9.91173L16.1914 22.5031L1.90735e-06 31.8071L2.55263e-06 24.426L13.3039 16.8587L13.3039 15.3701L4.01129e-06 7.74079L4.64031e-06 0.545702Z"
                  fill="#1A4434"
                />
              </svg>
            </button>{" "}
          </div>
        </div>
        {/* arrows */}
      </div>
    );
  }
}
