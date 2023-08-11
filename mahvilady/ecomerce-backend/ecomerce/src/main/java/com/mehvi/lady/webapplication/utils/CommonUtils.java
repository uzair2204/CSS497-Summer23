package com.mehvi.lady.webapplication.utils;

import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Objects;

public class CommonUtils {
    public static <E> Boolean isNullOrEmptyCollection(Collection<E> collection){
        return Objects.isNull(collection) || collection.isEmpty();
    }

    public static boolean isNullOrEmptyString(String str){
        return Objects.isNull(str) || str.trim().isEmpty();
    }
}
