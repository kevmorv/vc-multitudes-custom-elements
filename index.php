<?php
/**
Plugin Name: VCWB Multitudes Elements API 
Description: Custom elements for Visual Composer
Version: 0.0.1
Author: Kevin Morvi
Author URI: https://kmorvillier.dev
*/

// don't load directly
if (!defined('ABSPATH')) {
    die('-1');
}

add_action(
/**
 * @param $api \VisualComposer\Modules\Api\Factory
 */
    'vcv:api',
    function ($api) {
        $elementsToRegister = [
            "demoGridItem",
            "profileSection",
            "imageSlider"
        ];
        $pluginBaseUrl = rtrim(plugins_url(basename(__DIR__)), '\\/');
        /** @var \VisualComposer\Modules\Elements\ApiController $elementsApi */
        $elementsApi = $api->elements;
        foreach ($elementsToRegister as $tag) {
            $manifestPath = __DIR__ . '/elements/' . $tag . '/manifest.json';
            $elementBaseUrl = $pluginBaseUrl . '/elements/' . $tag;
            $elementsApi->add($manifestPath, $elementBaseUrl);
        }
    }
);
