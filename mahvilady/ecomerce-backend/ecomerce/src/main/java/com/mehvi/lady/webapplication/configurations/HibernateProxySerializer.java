package com.mehvi.lady.webapplication.configurations;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.hibernate.proxy.HibernateProxy;
import java.io.IOException;

public class HibernateProxySerializer extends JsonSerializer<HibernateProxy> {

    @Override
    public void serialize(HibernateProxy value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        // Serialize the actual target object of the proxy
        serializers.defaultSerializeValue(value.getHibernateLazyInitializer().getImplementation(), gen);
    }
}