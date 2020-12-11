# This file is autogenerated. Do not edit it by hand. Regenerate it with:
#   srb rbi gems

# typed: strict
#
# If you would like to make changes to this file, great! Please create the gem's shim here:
#
#   https://github.com/sorbet/sorbet-typed/new/master?filename=lib/debase/all/debase.rbi
#
# debase-2.3.2

module Debase
  def self.add_breakpoint(file, line, block_index = nil, is_all_suspensions = nil, expr = nil); end
  def self.add_catchpoint(exception); end
  def self.clear_catchpoints; end
  def self.debug; end
  def self.do_set_flags(iseq, path); end
  def self.file_filter; end
  def self.handler; end
  def self.handler=(arg0); end
  def self.keep_frame_binding; end
  def self.keep_frame_binding=(arg0); end
  def self.last_context; end
  def self.monkey_patch_prepend; end
  def self.mp_load_iseq; end
  def self.post_mortem?; end
  def self.remove_breakpoint(id); end
  def self.remove_catchpoint(exception); end
  def self.skip; end
  def self.source_reload; end
  def self.start(options = nil, &block); end
  def self.start_; end
  def self.stop; end
  def self.tracing; end
  def self.tracing=(arg0); end
end
class Debase::Context
  def at_breakpoint(breakpoint); end
  def at_catchpoint(excpt); end
  def at_line(file, line); end
  def at_return(file, line); end
  def at_tracing(file, line); end
  def frame_args_info(frame_no = nil); end
  def frame_class(frame_no = nil); end
  def frame_locals(frame_no = nil); end
  def handler; end
end
module InvalidName___Class_0x00___InstructionSequenceMixin_7
  def translate(iseq); end
end
module InvalidName___Class_0x00___InstructionSequenceMixin2_8
  def do_set_flags(iseq, path); end
  def load_iseq(path); end
end
class Debase::FileFilter
  def accept?(file_path); end
  def disable; end
  def enable; end
  def exclude(file_path); end
  def excluded; end
  def include(file_path); end
  def included; end
  def initialize; end
end
class Debase::DebugThread < Thread
  def self.inherited; end
end