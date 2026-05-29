package com.myblog.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class SlugUtil {

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) return "";
        String slug = input.toLowerCase().trim()
                .replaceAll("[^a-z0-9\\u4e00-\\u9fa5\\s-]", "")
                .replaceAll("[\\s]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        return slug.isEmpty() ? "untitled" : slug;
    }

    public static String toSlugWithTimestamp(String input) {
        return toSlug(input) + "-" + System.currentTimeMillis() % 100000;
    }
}
