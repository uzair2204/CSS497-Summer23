package com.mehvi.lady.webapplication.configurations;

import com.fasterxml.jackson.databind.module.SimpleModule;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.boot.jackson.JsonComponent;
import org.springframework.context.annotation.Bean;

@JsonComponent
public class HibernateProxyJsonComponent {

    @Bean
    public SimpleModule hibernateProxyModule() {
        SimpleModule module = new SimpleModule();
        module.addSerializer(HibernateProxy.class, new HibernateProxySerializer());
        return module;
    }
}
