package types

import "fmt"

type HandlerFunction = func(msg []byte, c *RouterContext) []byte

type Router struct {
	handlers map[string]HandlerFunction
	context  *RouterContext
}

type RouterGroup struct {
	handlers map[string]HandlerFunction
}

func (r *RouterGroup) Register(action string, handler HandlerFunction) {
	r.handlers[action] = handler
}

func (r *Router) Register(action string, handler HandlerFunction) {
	if _, ok := r.handlers[action]; ok {
		panic("Duplicate handler found for action: " + action)
	}
	r.handlers[action] = handler
}

func (r *Router) Mount(factory func() *RouterGroup) {
	router := factory()
	for action, handler := range router.handlers {
		r.Register(action, handler)
	}
}

func (r *Router) Handle(action string, msg []byte) []byte {
	if r.context == nil {
		panic("RouterContext is nil")
	}
	if _, ok := r.handlers[action]; !ok {
		fmt.Printf("No handler found for action: " + action)
		return nil
	}
	return r.handlers[action](msg, r.context)
}

func NewRouter(context *RouterContext) *Router {
	return &Router{
		handlers: make(map[string]HandlerFunction),
		context:  context,
	}
}

func NewRouterGroup() RouterGroup {
	return RouterGroup{
		handlers: make(map[string]HandlerFunction),
	}
}
