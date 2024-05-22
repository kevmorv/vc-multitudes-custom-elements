import React from "react";
import classNames from "classnames";
import { getService } from "vc-cake";

const vcvAPI = getService("api");

export default class DemoGridItem extends vcvAPI.elementComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     data: null,
  //     loading: true,
  //     error: null,
  //   };
  // }

  // componentDidMount() {
  //   // Make the fetch request here
  //   fetch("http://localhost:10013/wp-json/wp/v2/tags")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       this.setState({
  //         data: data,
  //         loading: false,
  //       });
  //     })
  //     .catch((error) => {
  //       this.setState({
  //         error: error,
  //         loading: false,
  //       });
  //     });
  // }

  render() {
    // const { data, loading, error } = this.state;
    // console.log("data", data);
    // console.log("loading", loading);
    // console.log("error", error);
    const { padding, background, animation, tag } = this.props.atts;
    console.log("atts", this.props.atts);
    const postDescriptionClasses = classNames({
      "vce-post-description": true,
      "vce-post-description--full": !padding,
      "vce-post-description--animation": animation,
      "vce-post-description--has-background": padding && background,
    });
    const backgroundStyle = {};
    if (padding && background) {
      backgroundStyle.backgroundColor = background;
    }
    return (
      <article className="vce-demo-grid-item profile" data-tags="{{post_tags}}">
        <div className={postDescriptionClasses} style={backgroundStyle}>
          {/* ca ca marche */}
          {"{{custom_post_description_featured_image}}"}
          <p class="profile-name">{"{{post_title}}"}</p>
          {"{{post_content}}"}
          {"{{post_tags}}"}
        </div>
      </article>
    );
  }
}
