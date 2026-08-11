package com.example.smart.home.automation.mqtt.topics;

public class MqttTopics {

    public static final class Publish {

        public static final String BINDING_TOPIC = "agent/binding/request";
        public static final String SCAN_TOPIC = "agent/%s/scan/request";
        public static final String CREATE_THING_TOPIC = "agent/%s/create/thing/request";
        public static final String CONTROL_THING_TOPIC = "agent/%s/control/thing/request";
        public static final String CREATE_RULE_TOPIC = "agent/%s/create/rule/request";
        public static final String ENABLE_RULE_TOPIC = "agent/%s/enable/rule/request";
        public static final String DELETE_RULE_TOPIC = "agent/%s/delete/rule/request";

        public static String scan(String localAgentId) {
            return String.format(SCAN_TOPIC, localAgentId);
        }

        public static String createThing(String localAgentId) {
            return String.format(CREATE_THING_TOPIC, localAgentId);
        }

        public static String controlThing(String localAgentId) {
            return String.format(CONTROL_THING_TOPIC, localAgentId);
        }

        public static String createRule(String localAgentId) {
            return String.format(CREATE_RULE_TOPIC, localAgentId);
        }

        public static String enableRule(String localAgentId) {
            return String.format(ENABLE_RULE_TOPIC, localAgentId);
        }

        public static String deleteRule(String localAgentId) {
            return String.format(DELETE_RULE_TOPIC, localAgentId);
        }

    }

    public static final class Subscribe {

        public static final String OPENHAB_EVENT_TOPIC = "agent/+/event/response";
        public static final String SCAN_TOPIC = "agent/+/scan/response";
        public static final String CREATE_THING_TOPIC = "agent/+/create/thing/response";
        public static final String CONTROL_THING_TOPIC = "agent/+/control/thing/response";
        public static final String CREATE_RULE_TOPIC = "agent/+/create/rule/response";
        public static final String ENABLE_RULE_TOPIC = "agent/+/enable/rule/response";
        public static final String DELETE_RULE_TOPIC = "agent/+/delete/rule/response";

    }

}