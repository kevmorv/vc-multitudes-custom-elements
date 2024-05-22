import React from "react";
import lodash from "lodash";
import { getService, getStorage } from "vc-cake";
import { setCssVariables } from "vc-helpers";

const vcvAPI = getService("api");
// export const URL_PATH = "http://" + window.location.host + "/wp-json/wp/v2/";

export default class ProfileSection extends vcvAPI.elementComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      shortcode: "",
      shortcodeContent: this.spinnerHTML(),
      filterList: [],
      numProfiles: 0,
    };
    this.debounceRequest = lodash.debounce(this.requestToServer, 750);
  }

  createFilterList(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const articles = doc.querySelectorAll("article");

    // Get the number of article tags
    const numProfiles = articles.length;

    let dataList = new Array();
    articles.forEach((article) => {
      let dataListValue = article.getAttribute("data-tags");
      dataListValue = dataListValue.split(", ");
      console.log("dataListValue", dataListValue);
      if (dataListValue) {
        dataList.push(...dataListValue);
        console.log("dataListSet", dataList);
      }
    });

    // Convert the set to an array (optional)
    dataList = dataList.filter((item) => item !== "");
    const filterList = Array.from(new Set(dataList));
    // console.log(`Number of article tags: ${articleCount}`);
    return [filterList, numProfiles];
  }
  componentDidMount() {
    this.requestToServer();
  }

  componentDidUpdate(prevProps) {
    const isEqual = lodash.isEqual;
    if (!isEqual(this.props.atts, prevProps.atts)) {
      this.debounceRequest();
    }
  }

  componentwillUnmount() {
    if (this.serverRequest) {
      this.serverRequest.cancelled = true;
    }
  }
  requestToServer() {
    if (!this.props.atts.gridItem || !this.props.atts.sourceItem) {
      return;
    }
    const dataProcessService = getService("dataProcessor");
    const Cook = getService("cook");
    const settingsStorage = getStorage("settings");
    let postData = settingsStorage.state("postData").get();
    // console.log("postData", postData);
    const GridItemComponent = Cook.get(this.props.atts.gridItem);
    const SourceItemComponent = Cook.get(this.props.atts.sourceItem);
    const filters = this.props.atts.filterItem;
    // console.log("filters", filters);
    const FilterComponent = Cook.get(this.props.atts.filterItem);
    // console.log("filter component", FilterComponent);

    const gridItemOutput = GridItemComponent.render(null, false);
    const sourceItemOutput = SourceItemComponent.render(null, false);
    const filterOutput = FilterComponent.render(null, false);
    const ReactDOMServer = require("react-dom/server");
    const striptags = require("striptags");
    if (this.ref.current) {
      this.ref.current.innerHTML = this.spinnerHTML();
    }
    console.log("filterout pu t", filterOutput);
    console.log("sourceitem", this.props.atts.sourceItem);
    console.log("source item outupt", sourceItemOutput);
    console.log(
      "fitler dom",
      ReactDOMServer.renderToStaticMarkup(filterOutput)
    );
    // console.log("griditem", this.props.atts.gridItem);

    console.log(
      "source item",
      ReactDOMServer.renderToStaticMarkup(sourceItemOutput)
    );
    console.log(
      "grid item",
      ReactDOMServer.renderToStaticMarkup(gridItemOutput)
    );
    // console.log("csv-atts", {
    //   tag: this.props.atts.sourceItem.tag,
    //   value: striptags(ReactDOMServer.renderToStaticMarkup(sourceItemOutput)),
    // });
    this.serverRequest = dataProcessService
      .appServerRequest({
        "vcv-action": "elements:posts_grid:adminNonce",
        "vcv-nonce": window.vcvNonce,
        "vcv-content": ReactDOMServer.renderToStaticMarkup(gridItemOutput),
        "vcv-source-id": window.vcvSourceID,
        "vcv-atts": {
          source: encodeURIComponent(
            JSON.stringify({
              tag: this.props.atts.sourceItem.tag,
              value: striptags(
                ReactDOMServer.renderToStaticMarkup(sourceItemOutput)
              ),
            })
          ),
          unique_id: this.props.id,
          // excerpt: this.props.atts.atts_excerpt ? "1" : "0",
          // excerpt_length: this.props.atts.atts_excerpt_length,
          pagination: this.props.atts.atts_pagination ? "1" : "0",
          pagination_color: this.props.atts.atts_pagination_color,
          pagination_per_page: this.props.atts.atts_pagination_per_page,
          // filter: this.props.atts.filtersToggle,
          // filter_atts: encodeURIComponent(
          //   JSON.stringify(this.props.atts.filterItem)
          // ),
        },
      })
      .then((result) => {
        // console.log("result", result);
        if (this.serverRequest && this.serverRequest.cancelled) {
          this.serverRequest = null;
          return;
        }
        // console.log("result", result);
        const response = this.getResponse(result);
        // console.log("shorcode", response.shortcodeContent);
        if (response && response.status) {
          if (this.ref.current) {
            this.ref.current.setAttribute("data-vcvs-html", response.shortcode);
            this.ref.current.innerHTML =
              response.shortcodeContent || "Failed to render the post grid";
          }
        } else {
          if (this.ref.current) {
            this.ref.current.setAttribute("data-vcvs-html", response.shortcode);
            this.ref.current.innerHTML =
              response.shortcodeContent || "Failed to render the post grid";
          }
        }
        const [filterList, numProfiles] = this.createFilterList(
          response.shortcodeContent
        );
        console.log("fitlerl ist", filterList);
        this.setState((prevState) => ({
          ...prevState,
          filterList,
          numProfiles,
        }));
      });
  }

  render() {
    const { id, atts, editor, children } = this.props;
    const {
      filterText,
      clearFiltersText,
      customClass,
      metaCustomId,
      gap,
      columns,
      atts_pagination_color: paginationColor,
      atts_pagination_active_color: paginationActiveColor,
      atts_pagination_text_color: paginationTextColor,
      atts_pagination_active_text_color: paginationActiveTextColor,
    } = atts;
    const gapPx = `${gap}px`;
    const paginationHoverColor = this.getColorShade(-0.1, paginationColor);
    const paginationActiveHoverColor = this.getColorShade(
      -0.1,
      paginationActiveColor
    );
    const cssVars = {
      gapPx,
      columns,
      paginationColor,
      paginationActiveColor,
      paginationTextColor,
      paginationActiveTextColor,
      paginationHoverColor,
      paginationActiveHoverColor,
    };
    const styleObj = setCssVariables(cssVars);
    const wrapperClasses = "vce vce-demo-grid-wrapper";
    const containerClasses = "vce-demo-grid-container";

    const customProps = {};

    if (customClass) {
      containerClasses += ` ${customClass}`;
    }
    if (metaCustomId) {
      customProps.id = metaCustomId;
    }

    const doAll = this.applyDO("all");

    return (
      <div
        className={containerClasses}
        {...customProps}
        {...editor}
        style={styleObj}
      >
        <div className="filter-section">
          <div>
            <span className="filter-title">{filterText}</span>

            <div className="filter-btn-wrapper">
              {this.state.filterList.map((item, index) => (
                <div key={index}>
                  <input
                    className="filter-checkbox"
                    type="checkbox"
                    id={`checkbox-${index}`}
                    data-item-id={item}
                    value={item}
                  />
                  <label htmlFor={`checkbox-${index}`}>{item}</label>
                </div>
              ))}
            </div>
            <div>
              <button className="clear-filters-btn">{clearFiltersText}</button>
            </div>
          </div>
        </div>
        {children}
        <div className={wrapperClasses} id={"el-" + id} {...doAll}>
          <div className="vcvhelper" ref={this.ref} />
        </div>
      </div>
    );
  }
}
